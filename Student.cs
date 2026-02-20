namespace EducationalPlatform.API.Models
{
    public class Student
    {
        public int Id { get; set; }         // المفتاح الأساسي
        public string Name { get; set; } = "";    // اسم الطالب
        public string Email { get; set; } = "";   // البريد الإلكتروني
        public DateTime EnrollmentDate { get; set; } // تاريخ التسجيل

        // ✅ جديد: هل تم قبول الطالب من الأدمن؟
        public bool Approved { get; set; } = false;
    }
}
