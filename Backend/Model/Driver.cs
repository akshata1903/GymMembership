using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Mini_Logestic_System.Model
{
    public class Driver
    {
        public int DriverID { get; set; }
        [Required]
        public string DriverName { get; set; }
        [Required]
        public string LicenseNumber { get; set; }
        public long PhoneNumber { get; set; }
        public int ExperienceYear { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TripStatus Status { get; set; }

        [JsonIgnore]
        public ICollection<Trips> Trips { get; set; } = new List<Trips>();
    }
}
