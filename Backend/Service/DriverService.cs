using Mini_Logestic_System.Data;
using Mini_Logestic_System.Model;
using Microsoft.EntityFrameworkCore;

namespace Mini_Logestic_System.Service
{
    public class DriverService : IDriverService
    {
        private readonly TripDBContext _context;

        public DriverService(TripDBContext context)
        {
            _context = context;
        }

        // Get all drivers
        public async Task<IEnumerable<Driver>> GetAllDriver()
        {
            return await _context.Drivers
                .Include(d => d.Trips)
                .ToListAsync();
        }

        // Get driver by ID
        public async Task<Driver?> GetByIdDriver(int id)
        {
            return await _context.Drivers
                .Include(d => d.Trips)
                .FirstOrDefaultAsync(d => d.DriverID == id);
        }

        // Add a new driver
        public async Task AddDriver(Driver driver)
        {
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
        }

        // Update existing driver
        public async Task UpdateDriver(Driver driver)
        {
            _context.Drivers.Update(driver);
            await _context.SaveChangesAsync();
        }

        // Get driver trip summary using stored procedure and save/update DB
        public async Task<DriverTripSummary?> GetDriverTripSummary(int driverId)
        {
            var summary = (await _context.DriverTripSummaries
                .FromSqlRaw("EXEC GetDriverTripSummary @DriverID = {0}", driverId)
                .AsNoTracking()
                .ToListAsync())
                .FirstOrDefault();

            return summary;
        }




        // Delete driver by ID
        public async Task DeleteDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver != null)
            {
                _context.Drivers.Remove(driver);
                await _context.SaveChangesAsync();
            }
        }
    }
}
