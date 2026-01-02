using Mini_Logestic_System.Model;

namespace Mini_Logestic_System.Service
{
    public interface IDriverService
    {
        Task<IEnumerable<Driver>> GetAllDriver();
        Task<Driver?> GetByIdDriver(int id);
        Task AddDriver(Driver driver);
        Task UpdateDriver(Driver driver);
        Task<DriverTripSummary?> GetDriverTripSummary(int driverId);
        Task DeleteDriver(int id);

    }
}
