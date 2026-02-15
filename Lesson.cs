using static System.Collections.Specialized.BitVector32;

namespace EducationalPlatform.API.Models
{
    public class Lesson
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }

        // Added: video for each lesson
        public string? VideoUrl { get; set; }

        public int SubjectId { get; set; }
        public required Subject Subject { get; set; }
        public int SectionId { get; set; }
        public required Section Section { get; set; }

    }
}

