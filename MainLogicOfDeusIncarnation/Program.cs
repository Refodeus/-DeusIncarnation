using MainLogicOfDeusIncarnation;
using Microsoft.EntityFrameworkCore;

//������������� � ������������ ���-����������
var builder = WebApplication.CreateBuilder(args);

//����������� � ��
builder.Services.AddDbContext<AppDbContext>(options => 
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
//���������� ��������� ���-����������� ������
builder.Services.AddRazorPages();

//������ ���-����������
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var movies = await context.Movies.ToListAsync();
    foreach (var movie in movies)
    {
        Console.WriteLine(movie.title);
    }
}


if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseEndpoints(endpoints =>
{
	endpoints.MapControllerRoute(name: "default", pattern: "{controller=ControllerRouting}/{action=Index}/{id?}");
});

app.UseAuthorization();

app.MapRazorPages();

app.Run();
