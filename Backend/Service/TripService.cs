using Mini_Logestic_System.Data;
using Mini_Logestic_System.Model;
using Microsoft.EntityFrameworkCore;

namespace Mini_Logestic_System.Service
{
    public class TripService : ITripService
    {
        private readonly TripDBContext _context;

        public TripService(TripDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Trips>> GetAllTrips()
        {
            return await _context.Trips
                .Include(t => t.AssignedDriver)
                .Include(t => t.AssignedVehicle)
                .ToListAsync();
        }

        public async Task<Trips?> GetByIdTrips(int id)
        {
            return await _context.Trips
                .Include(t => t.AssignedDriver)
                .Include(t => t.AssignedVehicle)
                .FirstOrDefaultAsync(t => t.TripID == id);
        }

        public async Task AddTrips(Trips trip)
        {
            // ✅ Automatically set the current local time when a trip is created
            trip.StartTime = DateTime.Now;

            // Only assign driver/vehicle if trip is NOT Completed
            if (trip.Status != TripStatus.Completed)
            {
                var availableDriver = await _context.Drivers
                    .FirstOrDefaultAsync(d => d.Status == TripStatus.Available);
                var availableVehicle = await _context.Vehicles
                    .FirstOrDefaultAsync(v => v.Status == TripStatus.Available);

                if (availableDriver == null || availableVehicle == null)
                    throw new InvalidOperationException("No available driver or vehicle found.");

                trip.AssignedDriverId = availableDriver.DriverID;
                trip.AssignedVehicleId = availableVehicle.VehicleID;

                availableDriver.Status = TripStatus.InUse;
                availableVehicle.Status = TripStatus.InUse;
            }

            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTrips(Trips trip)
        {
            var existingTrip = await _context.Trips
                .Include(t => t.AssignedDriver)
                .Include(t => t.AssignedVehicle)
                .FirstOrDefaultAsync(t => t.TripID == trip.TripID);

            if (existingTrip == null)
                throw new InvalidOperationException("Trip not found");

            // ✅ Safely update Source & Destination
            if (!string.IsNullOrEmpty(trip.Source))
                existingTrip.Source = trip.Source;

            if (!string.IsNullOrEmpty(trip.Destination))
                existingTrip.Destination = trip.Destination;

            // ✅ If trip starts, set StartTime to current local time
            if (existingTrip.StartTime == null && trip.Status == TripStatus.InUse)
            {
                existingTrip.StartTime = DateTime.Now;
            }

            // ✅ If trip is marked as completed, set EndTime to current local time
            if (trip.Status == TripStatus.Completed)
            {
                existingTrip.EndTime = DateTime.Now;

                // Free up driver and vehicle
                if (existingTrip.AssignedDriver != null)
                    existingTrip.AssignedDriver.Status = TripStatus.Available;

                if (existingTrip.AssignedVehicle != null)
                    existingTrip.AssignedVehicle.Status = TripStatus.Available;
            }

            existingTrip.Status = trip.Status;

            _context.Trips.Update(existingTrip);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTrips(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip != null)
            {
                _context.Trips.Remove(trip);
                await _context.SaveChangesAsync();
            }
        }
    }
}
