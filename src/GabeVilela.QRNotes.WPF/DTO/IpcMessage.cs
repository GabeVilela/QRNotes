using System;
using System.Collections.Generic;
using System.Text;

namespace GabeVilela.QRNotes.WPF.DTO
{
    public class IpcMessage
    {
        public string Action { get; set; }
        public string Error { get; set; }
        public dynamic Payload { get; set; }
    }
}