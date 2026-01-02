using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Logestic_System.Model;
using Mini_Logestic_System.Service;

namespace Mini_Logestic_System.Controllers
{
    [Authorize(Roles = "Dispatcher")]
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }

        // GET: api/Vehicle
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vehicles = await _vehicleService.GetAllVehicle();
            return Ok(vehicles);
        }

        // GET: api/Vehicle/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var vehicle = await _vehicleService.GetByIdVehicle(id);
            if (vehicle == null) return NotFound();
            return Ok(vehicle);
        }

        // POST: api/Vehicle
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Vehicle vehicle)
        {
            // Validate model
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Save the vehicle using your service
            await _vehicleService.AddVehicle(vehicle);

            // Return 201 Created with a link to the newly created vehicle
            return CreatedAtAction(nameof(Get), new { id = vehicle.VehicleID }, vehicle);
        }


        // PUT: api/Vehicle/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Vehicle vehicle)
        {
            if (id != vehicle.VehicleID) return BadRequest("Vehicle ID mismatch");
            await _vehicleService.UpdateVehicle(vehicle);
            return NoContent();
        }

        // DELETE: api/Vehicle/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _vehicleService.DeleteVehicle(id);
            return NoContent();
        }
    }
}
