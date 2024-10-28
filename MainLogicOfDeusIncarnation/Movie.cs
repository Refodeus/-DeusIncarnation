using System.ComponentModel.DataAnnotations;
namespace MainLogicOfDeusIncarnation
{
    public class Movie
    {
        public int id { get; set; }
        public string title { get; set; }
        public double averagemark { get; set; }
        public TimeOnly time { get; set; }
        public string description { get; set; }
        public string type_video {  get; set; }
        public string genres { get; set; }

    }
}
