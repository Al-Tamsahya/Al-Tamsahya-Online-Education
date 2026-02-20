namespace EducationalPlatform.API.Models
{
    public class Enrollment
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public int SubjectId { get; set; }
        public Subject Subject { get; set; }

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    }
}
