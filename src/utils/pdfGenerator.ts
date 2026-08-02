import jsPDF from 'jspdf';
import { SecurityLog } from '../types';

export function generateIncidentSummaryPDF(logs: SecurityLog[]) {
  // Filter open or investigating high/critical severity incidents
  const highSeverityIncidents = logs.filter(
    l => (l.severity === 'critical' || l.severity === 'high') && (l.status === 'open' || l.status === 'investigating')
  );

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Background Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title
  doc.setTextColor(248, 250, 252);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AEGISSOC CYBER THREAT INCIDENT REPORT', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Executive Summary: Open High & Critical Severity Threats & AI Mitigation Protocols', 14, 18);
  doc.text(`Generated: ${new Date().toLocaleString()} | Security Level: RESTRICTED`, 14, 23);

  y = 35;

  // Overview Cards Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('INCIDENT FEED SUMMARY', 18, y + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Active High/Critical Incidents: ${highSeverityIncidents.length}`, 18, y + 14);
  
  const criticalCount = highSeverityIncidents.filter(i => i.severity === 'critical').length;
  const highCount = highSeverityIncidents.filter(i => i.severity === 'high').length;
  doc.text(`Critical Level: ${criticalCount}  |  High Level: ${highCount}`, 18, y + 20);

  const totalRiskScoreAvg = highSeverityIncidents.length > 0 
    ? (highSeverityIncidents.reduce((acc, curr) => acc + curr.riskScore, 0) / highSeverityIncidents.length).toFixed(1)
    : '0';
  doc.text(`Average Risk Score: ${totalRiskScoreAvg}/100`, 120, y + 14);
  doc.text(`AI SOC Remediation Engine: ONLINE`, 120, y + 20);

  y += 34;

  // Section Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('HIGH-SEVERITY OPEN INCIDENTS & RECOMMENDED AI MITIGATION STEPS', 14, y);
  y += 6;

  if (highSeverityIncidents.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('No active open high or critical severity incidents found in the SOC queue.', 14, y + 8);
  } else {
    highSeverityIncidents.forEach((inc, idx) => {
      // Page break check
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      // Incident Container Box
      const boxHeight = 44;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(inc.severity === 'critical' ? 225 : 234, inc.severity === 'critical' ? 29 : 88, inc.severity === 'critical' ? 72 : 12);
      doc.rect(14, y, pageWidth - 28, boxHeight, 'D');

      // Incident Header Tag
      doc.setFillColor(inc.severity === 'critical' ? 225 : 234, inc.severity === 'critical' ? 29 : 88, inc.severity === 'critical' ? 72 : 12);
      doc.rect(14, y, pageWidth - 28, 7, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text(
        `INCIDENT #${idx + 1} [${inc.id}] - ${inc.severity.toUpperCase()} SEVERITY (Risk Score: ${inc.riskScore}/100) - Status: ${inc.status.toUpperCase()}`,
        18,
        y + 5
      );

      // Incident Details Body
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(`Threat: ${inc.flaggedThreat || inc.action}`, 18, y + 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(`Source IP: ${inc.sourceIp}   |   Destination IP: ${inc.destinationIp}   |   User: ${inc.user}`, 18, y + 18);
      doc.text(`Protocol/Port: ${inc.protocol} / ${inc.port}   |   Detection Engine: ${inc.detectedBy}`, 18, y + 23);

      // Payload Message
      doc.setTextColor(100, 116, 139);
      const truncatedMessage = inc.rawMessage.length > 90 ? inc.rawMessage.substring(0, 90) + '...' : inc.rawMessage;
      doc.text(`Raw Log: "${truncatedMessage}"`, 18, y + 28);

      // AI Recommended Mitigation Steps Box
      doc.setFillColor(248, 250, 252);
      doc.rect(16, y + 31, pageWidth - 32, 10, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(109, 40, 217); // purple-700
      doc.text('AI Recommended Mitigation Action:', 18, y + 35);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      let defaultMitigation = '1. Sever host network interface via EDR agent. 2. Push IP block rule to edge firewall. 3. Invalidate active user SSO tokens.';
      if (inc.category === 'auth' || inc.action.includes('SSH')) {
        defaultMitigation = '1. Block attacker IP on perimeter firewall. 2. Revoke user SSH keys & force LDAP password reset. 3. Enable mandatory 2FA.';
      } else if (inc.category === 'email' || inc.action.includes('EMAIL')) {
        defaultMitigation = '1. Quarantine inbound email message globally. 2. Block sender domain on secure email gateway. 3. Audit recipient clicks.';
      } else if (inc.category === 'dns' || inc.action.includes('DNS')) {
        defaultMitigation = '1. Add C2 domain to sinkhole DNS server. 2. Terminate rogue local process ID. 3. Capture pcap for malware reverse engineering.';
      }
      doc.text(defaultMitigation, 18, y + 39);

      y += boxHeight + 6;
    });
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(`AegisSOC AI Security Platform - Restricted Confidential Document - Page ${i} of ${totalPages}`, 14, 290);
  }

  doc.save(`AegisSOC_High_Severity_Incidents_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
