using System.ComponentModel.DataAnnotations;

namespace Mini_Logestic_System.Model
{
    public class DriverTripSummary
    {
       
        public int DriverID { get; set; }
        public string DriverName { get; set; }
        public int TotalTrips { get; set; }
        public decimal TotalHours { get; set; }
    }

}
