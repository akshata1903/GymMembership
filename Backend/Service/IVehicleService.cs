using Mini_Logestic_System.Data;
using Mini_Logestic_System.Model;

namespace Mini_Logestic_System.Service
{
    public interface IVehicleService
    {
        Task<IEnumerable<Vehicle>> GetAllVehicle();
        Task<Vehicle?> GetByIdVehicle(int id);
        Task AddVehicle(Vehicle vehicle);
        Task UpdateVehicle(Vehicle vehicle);
        Task DeleteVehicle(int id);
    }
}
