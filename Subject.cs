namespace EducationalPlatform.API.Models
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int StageId { get; set; }
        public Stage Stage { get; set; }
    }
}
