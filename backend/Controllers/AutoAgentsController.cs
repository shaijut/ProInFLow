using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using TodoAPI.Repositories;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace TodoAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AutoAgentsController : ControllerBase
    {
        private readonly ILogger<AutoAgentsController> _logger;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly TaskAgentLogRepository _repository = new TaskAgentLogRepository();

        public AutoAgentsController(ILogger<AutoAgentsController> logger, IConfiguration configuration, HttpClient httpClient)
        {
            _logger = logger;
            _configuration = configuration;
            _httpClient = httpClient;
        }

        [HttpPost]
        [Route("invoke-agents")]
        public async Task<IActionResult> InvokeAgents([FromBody] MultiAgentRequest request)
        {
            var responses = new List<string>();

            int executionGroupCounter = 1; // Counter to dynamically assign ExecutionGroup based on selected agents
            string currentUserInput = request.UserInput; // Start with user input for the first agent                                                         
            bool doAllEndToEnd = request.DoAllEndToEnd; // Check if "Do all end to end" is selected in the frontend (this can be passed from the frontend, so you need to handle it)

            // Insert a record for each agent
            foreach (var agentName in request.AgentNames)
            {
                _repository.InsertTaskLog(request.TaskId, request.TaskName, agentName, currentUserInput, executionGroupCounter);
                executionGroupCounter++;
            }

            try
            {         

                foreach (var agentName in request.AgentNames)
                {
                    // Get the webhook URL for the agent from appsettings.json
                    var webhookUrl = GetWebhookUrlForAgent(agentName);
                    if (string.IsNullOrEmpty(webhookUrl))
                    {
                        responses.Add($"Error: Webhook URL for agent '{agentName}' not found.");
                        continue;
                    }

                    // Create the JSON content
                    var payload = new
                    {
                        user_input = currentUserInput // Use the currentUserInput (which is updated if it's end-to-end)
                    };

                    var jsonContent = JsonConvert.SerializeObject(payload);
                    var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

                    // Make the POST request to the webhook URL
                    try
                    {
                        var response = await _httpClient.PostAsync(webhookUrl, content);

                        // Capture response output
                        string outputData = string.Empty;
                        if (response.IsSuccessStatusCode)
                        {
                            // Read and process the response content
                            var responseContent = await response.Content.ReadAsStringAsync();
                            var data = JsonConvert.DeserializeObject<Rootobject>(responseContent);

                            outputData = data?.response.response.Replace("```json", "").Replace("```", "").Trim();

                            // Update the input for the next agent if "Do all end to end" is selected
                            if (doAllEndToEnd)
                            {
                                currentUserInput = outputData; // Pass the output of one agent as input to the next
                            }
                        }

                        // Update the status of the task log after receiving response
                        _repository.UpdateTaskLog(request.TaskId, agentName, outputData, response.IsSuccessStatusCode ? "Completed" : "Failed");
                    }
                    catch (Exception ex)
                    {
                        // Handle any exceptions and update status as failed
                        _repository.UpdateTaskLog(request.TaskId, agentName, "Error: " + ex.Message, "Failed");
                    }

                    // Delay for 2 seconds before invoking the next agent
                    await Task.Delay(2000);
                }

                return Ok(new
                {
                    message = "Request received. Work has started for agents: " + string.Join(", ", request.AgentNames)
                });

            }
            catch (Exception ex)
            {
                // Handle any exceptions and update status as failed
                _repository.UpdateTaskLog(request.TaskId, "Invoke Agents", "Error: " + ex.Message, "Failed");

                return BadRequest($"Error: {ex.Message}");
            }
        }


        // API method to get Task Logs by Task ID
        [HttpGet("get-task-log/{taskId}")]
        public IActionResult GetTaskLogByTaskId(int taskId)
        {
            try
            {
                var taskLogs = _repository.GetTaskLogByTaskId(taskId);
                return Ok(taskLogs);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("get-task-logs")]
        public ActionResult<List<TaskAgentLog>> GetTaskLogs()
        {
            try
            {
                var taskLogs = _repository.GetAllTaskLogs(); // Assume this method gets all task logs
                return Ok(taskLogs);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error fetching task logs: {ex.Message}");
            }
        }

        // Helper method to get the webhook URL for an agent
        private string GetWebhookUrlForAgent(string agentName)
        {
            return _configuration[$"AgentWebhooks:{agentName}"];
        }

        // Request object for multiple agents
        public class MultiAgentRequest
        {
            public int TaskId { get; set; }              // Task ID from the front end
            public string TaskName { get; set; }         // Task Name (title from todo)
            public string UserInput { get; set; }        // User Input for agents
            public List<string> AgentNames { get; set; } // List of agent names selected
            public bool DoAllEndToEnd { get; set; }     // Whether to process agents end-to-end (true/false)
        }


        // Response classes
        public class Rootobject
        {
            public Response response { get; set; }
        }

        public class Response
        {
            public string format { get; set; }
            public string heading { get; set; }
            public string response { get; set; }
        }


    }
}
