using Microsoft.AspNetCore.Mvc;
using TodoAPI.Repositories;
using System;

namespace TodoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TodoController : ControllerBase
    {
        private readonly TodoRepository _repository = new TodoRepository();

        [HttpGet]
        public ActionResult<List<TodoItem>> Get()
        {
            return Ok(_repository.GetAll());
        }

        [HttpGet("{id}")]
        public ActionResult<TodoItem> Get(int id)
        {
            var todo = _repository.GetById(id);
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo);
        }

        [HttpPost]
        public ActionResult Post([FromBody] TodoItem todo)
        {
            _repository.Add(todo);
            return CreatedAtAction(nameof(Get), new { id = todo.Id }, todo);
        }

        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] TodoItem todo)
        {
            var existingTodo = _repository.GetById(id);
            if (existingTodo == null)
            {
                return NotFound();
            }

            todo.Id = id;
            _repository.Update(todo);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var existingTodo = _repository.GetById(id);
            if (existingTodo == null)
            {
                return NotFound();
            }

            _repository.Delete(id);
            return NoContent();
        }

        [HttpPost("SavePomodoroSession")]
        public IActionResult SavePomodoroSession([FromBody] PomodoroSessionModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _repository.SavePomodoroSession(model.TodoId, model.TodoTitle, model.Phase, model.StartTime, model.EndTime);
                return Ok("Pomodoro session saved successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }

    public class PomodoroSessionModel
    {
        public int TodoId { get; set; }
        public string? TodoTitle { get; set; }
        public string? Phase { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
