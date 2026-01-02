using System.ComponentModel.DataAnnotations;

namespace Mini_Logestic_System.Model
{
    public class User
    {
        [Key]
        public int userId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string role { get; set; }

        public long? PhoneNumber { get; set; }
        public int? ExperienceYear { get; set; }
    }
}
