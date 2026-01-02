using Mini_Logestic_System.Model;

namespace Mini_Logestic_System.Service
{
    public interface ITripService
    {
        Task<IEnumerable<Trips>> GetAllTrips();
        Task<Trips?> GetByIdTrips(int id);
        Task AddTrips(Trips trip);
        Task UpdateTrips(Trips trip);
        Task DeleteTrips(int id);
    }
}
