using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Logestic_System.Model;
using Mini_Logestic_System.Service;
using System.Security.Claims;

namespace Mini_Logestic_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;

        public DriverController(IDriverService driverService)
        {
            _driverService = driverService;
        }

        // Dispatcher endpoints
        [HttpGet]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> GetAll()
        {
            var drivers = await _driverService.GetAllDriver();
            return Ok(drivers);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Get(int id)
        {
            var driver = await _driverService.GetByIdDriver(id);
            if (driver == null) return NotFound();
            return Ok(driver);
        }

        [HttpPost]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Create([FromBody] Driver driver)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _driverService.AddDriver(driver);
            return CreatedAtAction(nameof(Get), new { id = driver.DriverID }, driver);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Update(int id, [FromBody] Driver driver)
        {
            if (id != driver.DriverID) return BadRequest("Driver ID mismatch");
            await _driverService.UpdateDriver(driver);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Delete(int id)
        {
            await _driverService.DeleteDriver(id);
            return NoContent();
        }

        // Driver endpoint: get own trip summary
        [HttpGet("my-summary")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> GetMySummary()
        {
            var username = User.Identity?.Name;
            if (string.IsNullOrEmpty(username))
                return Unauthorized("Cannot determine logged-in driver.");

            var driver = (await _driverService.GetAllDriver())
                .FirstOrDefault(d => d.DriverName == username);

            if (driver == null)
                return NotFound("Driver not found.");

            var summary = await _driverService.GetDriverTripSummary(driver.DriverID);
            if (summary == null)
                return NotFound("No trips completed yet.");

            return Ok(summary);
        }
    }
}
