using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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
using GabeVilela.QRNotes.WPF.DTO;
using GabeVilela.QRNotes.WPF.Services;
using Microsoft.Web.WebView2.Core;

namespace GabeVilela.QRNotes.WPF
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private IpcHandler ipc;

        public MainWindow()
        {
            InitializeComponent();
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            await WebView.EnsureCoreWebView2Async(null);

            WebView.CoreWebView2.WebMessageReceived += ReceiveIpcMessage;
            WebView.CoreWebView2.Settings.IsGeneralAutofillEnabled = false;
            WebView.CoreWebView2.Settings.IsPasswordAutosaveEnabled = false;

            WebView.CoreWebView2.AddHostObjectToScript("qrNotes", new
            {
                Version = GetAppVersion()
            });
            ipc = new IpcHandler(WebView.CoreWebView2);

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

        private async void ReceiveIpcMessage(object sender, CoreWebView2WebMessageReceivedEventArgs args)
        {
            string messageJSON = args.TryGetWebMessageAsString();
            string msgReply;

            var message = ipc.TryParseMessage(messageJSON);

            msgReply = await ipc.GetReply(message);

            if (msgReply != null)
            {
                ipc.PostMessage(msgReply);
            }
        }

        private AppVersion GetAppVersion() => new AppVersion()
        {
            Assembly = Assembly.GetExecutingAssembly().GetName().Version.ToString(),
            WebView = WebView.CoreWebView2.Environment.BrowserVersionString
        };
    }
}
