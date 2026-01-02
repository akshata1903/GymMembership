using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Mini_Logestic_System.Model
{
    public class Vehicle
    {
        public int VehicleID { get; set; }
        [Required]
        public string VehicleType { get; set; }
        public decimal Capacity { get; set; }
        [Required]
        public string NumberPlate { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public TripStatus Status { get; set; }

        [JsonIgnore]
        public ICollection<Trips> Trips { get; set; } = new List<Trips>();
    }
}
