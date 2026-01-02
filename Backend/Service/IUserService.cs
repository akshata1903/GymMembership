using Mini_Logestic_System.Model;

namespace Mini_Logestic_System.Service
{
    public interface IUserService
    {
        Task<User?> ValidateUserAsync(string username, string password);
        string GenerateJwtToken(User user);
        Task RegisterDriverAsync(User user);
    }
}
