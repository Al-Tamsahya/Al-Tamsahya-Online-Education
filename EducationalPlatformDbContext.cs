using Microsoft.EntityFrameworkCore;
using EducationalPlatform.API.Models;

namespace EducationalPlatform.API.Data
{
    public class EducationalPlatformDbContext : DbContext
    {
        public EducationalPlatformDbContext(DbContextOptions<EducationalPlatformDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Stage> Stages { get; set; } = null!;
        public DbSet<Subject> Subjects { get; set; } = null!;
        public DbSet<Lesson> Lessons { get; set; } = null!;
        public DbSet<Enrollment> Enrollments { get; set; } = null!;
        public DbSet<LessonProgress> LessonProgresses { get; set; } = null!;
        public DbSet<EducationalPlatform.API.Models.Section> Sections { get; set; } = null!;
    }
}
