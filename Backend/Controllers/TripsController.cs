using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Mini_Logestic_System.Model;
using Mini_Logestic_System.Service;
using System.Security.Claims;

namespace Mini_Logestic_System.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // All endpoints require authentication
    public class TripsController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripsController(ITripService tripService)
        {
            _tripService = tripService;
        }

        // 🚛 Dispatcher can view all trips
        // 🚙 Driver can only see their own
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var username = User.Identity?.Name;

            var allTrips = await _tripService.GetAllTrips();

            if (role == "Dispatcher")
            {
                // Dispatcher sees all trips
                return Ok(allTrips);
            }
            else if (role == "Driver")
            {
                // Driver sees only their assigned trips
                var myTrips = allTrips
                    .Where(t => t.AssignedDriver != null &&
                                t.AssignedDriver.DriverName == username)
                    .ToList();

                return Ok(myTrips);
            }

            return Forbid("You do not have access to view trips.");
        }

        // 🧭 Get a specific trip
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            var username = User.Identity?.Name;

            var trip = await _tripService.GetByIdTrips(id);
            if (trip == null)
                return NotFound();

            if (role == "Dispatcher" ||
                (role == "Driver" && trip.AssignedDriver?.DriverName == username))
            {
                return Ok(trip);
            }

            return Forbid("You can only view your own trips.");
        }

        // 🆕 Dispatcher creates a new trip
        [HttpPost]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Create([FromBody] Trips trip)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _tripService.AddTrips(trip);
            var createdTrip = await _tripService.GetByIdTrips(trip.TripID);

            return CreatedAtAction(nameof(Get), new { id = createdTrip.TripID }, createdTrip);
        }

        // ✏️ Dispatcher updates an existing trip
        [HttpPut("{id}")]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Update(int id, [FromBody] Trips trip)
        {
            if (id != trip.TripID)
                return BadRequest("Trip ID mismatch");

            await _tripService.UpdateTrips(trip);
            return NoContent();
        }

        // ❌ Dispatcher deletes a trip
        [HttpDelete("{id}")]
        [Authorize(Roles = "Dispatcher")]
        public async Task<IActionResult> Delete(int id)
        {
            await _tripService.DeleteTrips(id);
            return NoContent();
        }

        // ✅ Driver marks their own trip as complete
        [HttpPut("complete/{tripId}")]
        [Authorize(Roles = "Driver")]
        public async Task<IActionResult> CompleteTrip(int tripId)
        {
            var username = User.Identity?.Name;

            var trip = await _tripService.GetByIdTrips(tripId);
            if (trip == null || trip.AssignedDriver?.DriverName != username)
                return Forbid("You can only modify your own trips.");

            trip.Status = TripStatus.Completed;
            await _tripService.UpdateTrips(trip);

            return Ok($"Trip {trip.TripID} marked as completed.");
        }
    }
}
