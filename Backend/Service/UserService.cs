using Microsoft.IdentityModel.Tokens;
using Mini_Logestic_System.Data;
using Mini_Logestic_System.Model;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace Mini_Logestic_System.Service
{
    public class UserService : IUserService
    {
        private readonly TripDBContext _context;
        private readonly IConfiguration _config;

        public UserService(TripDBContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<User?> ValidateUserAsync(string username, string password)
        {
            // 🔹 Case 1: Dispatcher (Admin)
            if (username == "dispatcher" && password == "1234")
            {
                return new User { UserName = username, Password = password, role = "Dispatcher" };
            }

            // 🔹 Case 2: Driver (Check DB)
            var driver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.DriverName == username && d.LicenseNumber == password);

            if (driver != null)
            {
                return new User
                {
                    UserName = driver.DriverName,
                    Password = driver.LicenseNumber,
                    role = "Driver"
                };
            }

            // ❌ Invalid credentials
            return null;
        }
        public async Task RegisterDriverAsync(User user)
        {
            if (user.role != "Driver")
                throw new InvalidOperationException("Only drivers can be registered.");

            var existingDriver = await _context.Drivers
                .FirstOrDefaultAsync(d => d.DriverName == user.UserName);
            if (existingDriver != null)
                throw new InvalidOperationException("Driver already exists");

            var newDriver = new Driver
            {
                DriverName = user.UserName,
                LicenseNumber = user.Password,
                PhoneNumber = user.PhoneNumber ?? 0,      // fallback if null
                ExperienceYear = user.ExperienceYear ?? 0,
                Status = TripStatus.Available
            };

            _context.Drivers.Add(newDriver);
            await _context.SaveChangesAsync();
        }




        public string GenerateJwtToken(User user)
        {
            // Read secret key from appsettings.json
            var key = Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]);

            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(ClaimTypes.Role, user.role)
    };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _config["JwtSettings:Issuer"],      // Must match Program.cs
                Audience = _config["JwtSettings:Audience"],  // Must match Program.cs
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }


    }
}
