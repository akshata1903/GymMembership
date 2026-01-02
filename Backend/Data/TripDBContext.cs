using Microsoft.EntityFrameworkCore;
using Mini_Logestic_System.Model;

namespace Mini_Logestic_System.Data
{
    public class TripDBContext : DbContext
    {
        public TripDBContext(DbContextOptions<TripDBContext> options) : base(options)
        {
        }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trips> Trips { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<DriverTripSummary> DriverTripSummaries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Vehicle
            modelBuilder.Entity<Vehicle>()
                .Property(v => v.Capacity)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Vehicle>()
                .Property(v => v.Status)
                .HasConversion<string>();

            // Configure Driver
            modelBuilder.Entity<Driver>()
                .Property(d => d.Status)
                .HasConversion<string>();

            // Configure Trips
            modelBuilder.Entity<Trips>()
                .HasOne(t => t.AssignedDriver)
                .WithMany(d => d.Trips)
                .HasForeignKey(t => t.AssignedDriverId);

            modelBuilder.Entity<Trips>()
                .HasOne(t => t.AssignedVehicle)
                .WithMany(v => v.Trips)
                .HasForeignKey(t => t.AssignedVehicleId);

            modelBuilder.Entity<Trips>()
                .Property(t => t.Status)
                .HasConversion<string>();

            // Configure DriverTripSummary
            modelBuilder.Entity<DriverTripSummary>(entity =>
            {
                entity.HasNoKey(); // Because it's mapped to a stored procedure, not a table
                entity.ToView(null);
                entity.Property(e => e.TotalHours).HasPrecision(18, 4); // Avoid truncation warning
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}
