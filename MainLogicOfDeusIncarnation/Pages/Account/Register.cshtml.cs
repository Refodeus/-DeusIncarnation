using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

namespace MainLogicOfDeusIncarnation.Pages.Account
{
    public class RegisterModel : PageModel
    {
        private readonly UserManager<IdentityUser> _userManager;

        public RegisterModel(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [BindProperty]
        public InputModel Input { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "Ћогин об€зателен")]
            public string NickName { get; set; }
            [Required(ErrorMessage = "”кажите почту")]
            public string Email { get; set; }
            [Required(ErrorMessage = "”кажите пароль")]
            public string Password { get; set; }
            [Required(ErrorMessage = "ѕароли не совпадают")]
            [Compare("Password")]
            public string ConfirmPassword { get; set; }
        }

        public void OnGet()
        {
        }
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid) 
                return Page();

            var user = new IdentityUser { UserName = Input.NickName, Email = Input.Email };
            var result = await _userManager.CreateAsync(user, Input.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("Index", "ControllerRouting");
            }

            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(string.Empty, error.Description);
            }

            return Page();
        }
    }
}
