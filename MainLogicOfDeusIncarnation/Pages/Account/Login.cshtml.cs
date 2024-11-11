using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace MainLogicOfDeusIncarnation.Pages.Account
{
    public class LoginModel : PageModel
    {
        private readonly SignInManager<IdentityUser> _signInManager;

        public LoginModel(SignInManager<IdentityUser> signInManager)
        {
            _signInManager = signInManager;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "Некорректная почта")]
            public string Email { get; set; }
            [Required(ErrorMessage = "Неверный пароль")]
            public string Password { get; set; }
        }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid) return Page();

            var user = await _signInManager.UserManager.Users.FirstOrDefaultAsync(x => x.Email == Input.Email);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Некорректный никнейм или пароль.");
                return Page();
            }
            var result = await _signInManager.PasswordSignInAsync(user, Input.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return RedirectToAction("Index", "ControllerRouting");
            }
            ModelState.AddModelError(string.Empty, "Неверный вход или пароль.");
            return Page();
        }
        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Index", "ControllerRouting");
        }
    }
}
