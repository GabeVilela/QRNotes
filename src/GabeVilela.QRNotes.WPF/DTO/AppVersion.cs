using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace GabeVilela.QRNotes.WPF.DTO
{
    [ClassInterface(ClassInterfaceType.AutoDual)]
    [ComVisible(true)]
    public class AppVersion
    {
        public string Assembly { get; set; }
        public string WebView { get; set; }
    }
}