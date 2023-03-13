using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace GabeVilela.QRNotes.WPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            InitializeWebView();
            //this.Visibility = Visibility.Hidden;
        }

        private async void InitializeWebView()
        {
            await WebView.EnsureCoreWebView2Async(null);
            WebView.CoreWebView2.Settings.IsGeneralAutofillEnabled = false;
            WebView.CoreWebView2.Settings.IsPasswordAutosaveEnabled = false;

#if DEBUG
            if (Environment.GetEnvironmentVariable("ANGULAR_DEV_SERVER") == "true")
            {
                WebView.CoreWebView2.Navigate("http://localhost:4200");
            }
            else
            {
                LoadAngularBuild();
            }
#else
            LoadAngularBuild();
            WebView.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;
#endif
        }

        private void LoadAngularBuild()
        {
            var path = AppDomain.CurrentDomain.BaseDirectory;
            path += @"\resources\ui";
            WebView.CoreWebView2.SetVirtualHostNameToFolderMapping("app", path, Microsoft.Web.WebView2.Core.CoreWebView2HostResourceAccessKind.Allow);
            WebView.CoreWebView2.Navigate("https://app/index.html");
        }

        private void WebView_NavigationCompleted(object sender, Microsoft.Web.WebView2.Core.CoreWebView2NavigationCompletedEventArgs e)
        {
            Title = WebView.CoreWebView2.DocumentTitle;
        }
    }
}
