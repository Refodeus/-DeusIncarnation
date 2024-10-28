using Microsoft.AspNetCore.Mvc;

namespace MainLogicOfDeusIncarnation
{
	public class ControllerRouting : Controller
	{
		public IActionResult Index()
		{
			return View();
		}
		public IActionResult Catalog()
		{
			return View();
		}
		public IActionResult History()
		{
			return View();
		}
		public IActionResult WillBeWatching()
		{
			return View();
		}
	}
}
