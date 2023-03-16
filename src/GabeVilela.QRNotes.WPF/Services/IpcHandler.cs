using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using GabeVilela.QRNotes.WPF.DTO;
using Microsoft.Web.WebView2.Core;

namespace GabeVilela.QRNotes.WPF.Services
{
    internal class IpcHandler
    {
        private readonly CoreWebView2 _webview;

        internal IpcHandler(CoreWebView2 webview)
        {
            _webview = webview;
        }

        internal IpcMessage TryParseMessage(string messageJSON)
        {
            if (string.IsNullOrWhiteSpace(messageJSON))
            {
                return null;
            }

            IpcMessage mensagem = JsonSerializer.Deserialize<IpcMessage>(messageJSON, new JsonSerializerOptions()
            {
                PropertyNameCaseInsensitive = true
            });

            return mensagem;
        }

        internal async Task<string> GetReply(IpcMessage message)
        {
            if (!string.IsNullOrWhiteSpace(message.Error))
            {
                return null;
            }

            object reply = null;

            switch (message.Action)
            {
                case "open-devtools":
                    _webview.OpenDevToolsWindow();
                    break;

                default:
                    return null;
            }

            return reply != null ? JsonSerializer.Serialize(reply) : null;
        }

        internal void PostMessage(string message)
        {
            _webview.PostWebMessageAsJson(message);
        }
    }
}