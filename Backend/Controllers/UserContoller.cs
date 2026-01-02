using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mini_Logestic_System.Model;
using Mini_Logestic_System.Service;


namespace Mini_Logestic_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                await _userService.RegisterDriverAsync(user);
                return Ok("Driver registered successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }





        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var validUser = await _userService.ValidateUserAsync(user.UserName, user.Password);
            if (validUser == null)
                return Unauthorized("Invalid username or password");

            var token = _userService.GenerateJwtToken(validUser);

            return Ok(new
            {
                token,
                role = validUser.role
            });
        }
    }
}
