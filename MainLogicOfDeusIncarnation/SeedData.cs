using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MainLogicOfDeusIncarnation
{
    public static class SeedData
    {
        public static async Task EnsureSeedData(IServiceProvider provider)
        {
            var roleManager = provider.GetRequiredService<RoleManager<IdentityRole>>();
            foreach (var roleName in RoleNames.AllRoles)
            {
                var role = await roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    var result = await roleManager.CreateAsync(new IdentityRole { Name = roleName });
                    if (!result.Succeeded) throw new Exception(result.Errors.First().Description);
                }
            }
            var userManager = provider.GetRequiredService<UserManager<IdentityUser>>();

            var adminResult = await userManager.CreateAsync(DefaultUsers.Administrator, "151617a");
            var userResult = await userManager.CreateAsync(DefaultUsers.User, "12345");

            if (adminResult.Succeeded)
            {
                var adminUser = await userManager.FindByEmailAsync(DefaultUsers.Administrator.Email);
                await userManager.AddToRoleAsync(adminUser, RoleNames.Administrator);

            }
            else
                throw new Exception("Ошибка при создании администратора: " + string.Join(", ", adminResult.Errors.Select(e => e.Description)));
            if (userResult.Succeeded)
            {
                var commonUser = await userManager.FindByEmailAsync(DefaultUsers.User.Email);
                await userManager.AddToRoleAsync(commonUser, RoleNames.User);
            }
            else
                throw new Exception("Ошибка при создании пользователя: " + string.Join(", ", userResult.Errors.Select(e => e.Description)));
    }

    }
    public static class RoleNames
    {
        public const string Administrator = "Администратор";
        public const string User = "Пользователь";
        public static IEnumerable<string> AllRoles
        {
            get
            {
                yield return Administrator;
                yield return User;
            }
        }
    }
    public static class DefaultUsers
    {
        public static readonly IdentityUser Administrator = new IdentityUser
        {
            Email = "Romylik22R@yandex.ru",
            EmailConfirmed = true,
            UserName = "Refodeus"
        };
        public static readonly IdentityUser User = new IdentityUser
        {
            Email = "JustUser@test.ru",
            EmailConfirmed = true,
            UserName = "JustUser"
        };
        public static IEnumerable<IdentityUser> AllUsers
        {
            get
             {
                yield return Administrator;
                yield return User;
            }
        }
    }
}
