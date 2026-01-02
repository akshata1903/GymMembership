using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Mini_Logestic_System.Model
{
    public enum TripStatus
    {
        None,
        InUse,
        Completed,
        Cancelled,
        Available,
        OnLeve
    }

    public class Trips
    {
        [Key]
        public int TripID { get; set; }

        [Required]
        public string Source { get; set; }

        [Required]
        public string Destination { get; set; }

        public DateTime? StartTime { get; set; }  // Nullable
        public DateTime? EndTime { get; set; }    // Nullable

        public TripStatus Status { get; set; }

        [JsonIgnore]
        public int? AssignedDriverId { get; set; }

        [JsonIgnore]
        public int? AssignedVehicleId { get; set; }

        // Navigation properties
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Driver? AssignedDriver { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public Vehicle? AssignedVehicle { get; set; }
    }
}
