using Microsoft.Data.Sqlite;

namespace TodoAPI.Repositories
{

    public class TaskAgentLogRepository
    {
        private readonly string _connectionString = "Data Source=App_Data/TodoDatabase.db";

        // Insert TaskAgentLog entry
        public void InsertTaskLog(int taskId, string taskName, string agentName, string inputData, int executionGroup)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText =
                @"
                    INSERT INTO TaskAgentLog (TaskId, TaskName, AgentName, InputData, ExecutionGroup, Start_Timestamp)
                    VALUES (@TaskId, @TaskName, @AgentName, @InputData, @ExecutionGroup, @Start_Timestamp);
                ";

                command.Parameters.AddWithValue("@TaskId", taskId);
                command.Parameters.AddWithValue("@TaskName", taskName);
                command.Parameters.AddWithValue("@AgentName", agentName);
                command.Parameters.AddWithValue("@InputData", inputData);
                command.Parameters.AddWithValue("@ExecutionGroup", executionGroup);
                command.Parameters.AddWithValue("@Start_Timestamp", DateTime.Now);

                command.ExecuteNonQuery();
            }
        }

        // Update TaskAgentLog entry with OutputData, Status, and End_Timestamp
        public void UpdateTaskLog(int taskId, string agentName, string outputData, string status)
        {
            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText =
                @"
                   UPDATE TaskAgentLog SET OutputData = @OutputData, Status = @Status, End_Timestamp = @End_Timestamp
                   WHERE TaskId = @TaskId AND AgentName = @AgentName;
                ";

                command.Parameters.AddWithValue("@TaskId", taskId);
                command.Parameters.AddWithValue("@AgentName", agentName);
                command.Parameters.AddWithValue("@OutputData", outputData);
                command.Parameters.AddWithValue("@Status", status);
                command.Parameters.AddWithValue("@End_Timestamp", DateTime.Now);

                command.ExecuteNonQuery();
            }
        }

        public List<TaskAgentLog> GetAllTaskLogs()
        {
            var logs = new List<TaskAgentLog>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM TaskAgentLog";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        logs.Add(new TaskAgentLog
                        {
                            Id = Convert.ToInt32(reader["Id"]),
                            TaskId = Convert.ToInt32(reader["TaskId"]),
                            TaskName = reader["TaskName"].ToString(),
                            AgentName = reader["AgentName"].ToString(),
                            InputData = reader["InputData"].ToString(),
                            OutputData = reader["OutputData"].ToString(),
                            Status = reader["Status"].ToString(),
                            ExecutionGroup = Convert.ToInt32(reader["ExecutionGroup"]),
                            StartTimestamp = Convert.ToDateTime(reader["Start_Timestamp"]),
                            EndTimestamp = reader["End_Timestamp"] != DBNull.Value ? Convert.ToDateTime(reader["End_Timestamp"]) : (DateTime?)null
                        });
                    }
                }
            }

            return logs;
        }

        // Fetch task log details by TaskId
        public List<TaskAgentLog> GetTaskLogByTaskId(int taskId)
        {
            var logs = new List<TaskAgentLog>();

            using (var connection = new SqliteConnection(_connectionString))
            {
                connection.Open();

                var command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM TaskAgentLog WHERE TaskId = @TaskId";
                command.Parameters.AddWithValue("@TaskId", taskId);

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        logs.Add(new TaskAgentLog
                        {
                            Id = Convert.ToInt32(reader["Id"]),
                            TaskId = Convert.ToInt32(reader["TaskId"]),
                            TaskName = reader["TaskName"].ToString(),
                            AgentName = reader["AgentName"].ToString(),
                            InputData = reader["InputData"].ToString(),
                            OutputData = reader["OutputData"].ToString(),
                            Status = reader["Status"].ToString(),
                            ExecutionGroup = Convert.ToInt32(reader["ExecutionGroup"]),
                            StartTimestamp = Convert.ToDateTime(reader["Start_Timestamp"]),
                            EndTimestamp = reader["End_Timestamp"] != DBNull.Value ? Convert.ToDateTime(reader["End_Timestamp"]) : (DateTime?)null
                        });
                    }
                }
            }

            return logs;
        }
    }

    public class TaskAgentLog
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string TaskName { get; set; }
        public string AgentName { get; set; }
        public string InputData { get; set; }
        public string OutputData { get; set; }
        public string Status { get; set; }
        public int ExecutionGroup { get; set; }
        public DateTime StartTimestamp { get; set; }
        public DateTime? EndTimestamp { get; set; }
    }

}
