using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;


namespace MainLogicOfDeusIncarnation
{
    public class LogOutController : Controller
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        public LogOutController(SignInManager<IdentityUser> signInManager)
        {
            _signInManager = signInManager;
        }
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "ControllerRouting");
        }
    }
}
