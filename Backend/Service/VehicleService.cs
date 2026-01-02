using Mini_Logestic_System.Data;
using Mini_Logestic_System.Model;
using Microsoft.EntityFrameworkCore;

namespace Mini_Logestic_System.Service
{
    public class VehicleService : IVehicleService
    {
        private readonly TripDBContext _context;

        public VehicleService(TripDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetAllVehicle()
        {
            // You can include Trips if needed
            return await _context.Vehicles
                .Include(v => v.Trips)
                .ToListAsync();
        }

        public async Task<Vehicle?> GetByIdVehicle(int id)
        {
            return await _context.Vehicles
                .Include(v => v.Trips)
                .FirstOrDefaultAsync(v => v.VehicleID == id);
        }

        public async Task AddVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Update(vehicle);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle != null)
            {
                _context.Vehicles.Remove(vehicle);
                await _context.SaveChangesAsync();
            }
        }
    }
}
