# AudexaAI DNS Configuration Guide

This document summarizes all DNS-related configuration steps required to connect
your NameBright domain **audexaai.com** to AWS Route53, CloudFront, and ACM.

---

## 1. NameBright Configuration

Because your domain is registered at **NameBright**, you must delegate DNS authority
to AWS Route53 by updating the domain’s nameservers.

### Steps:
1. Log in to **NameBright**.
2. Navigate to:  
   **Domains → Manage Domain → Nameservers**
3. Replace the existing nameservers with the 4 Route53 nameservers from your hosted zone.

### Example (your actual values may differ):
```
ns-1234.awsdns-12.com
ns-5678.awsdns-45.net
ns-9012.awsdns-67.org
ns-3456.awsdns-89.co.uk
```

Once changed, DNS for **audexaai.com** is officially controlled by AWS Route53.

Propagation time: **5–30 minutes**.

---

## 2. Route53 Hosted Zone Setup

A hosted zone for **audexaai.com** is created inside AWS Route53.

It contains several required DNS records.

---

### 2.1 Root Domain Record (A Alias → CloudFront)

| Field | Value |
|-------|--------|
| Type | A (Alias) |
| Name | audexaai.com |
| Alias Target | Your CloudFront Distribution |

This ensures that visiting `https://audexaai.com` loads your site.

---

### 2.2 WWW Subdomain (CNAME → CloudFront)

| Field | Value |
|-------|--------|
| Type | CNAME |
| Name | www.audexaai.com |
| Value | `<your-cloudfront-id>.cloudfront.net` |

Enables `https://www.audexaai.com`.

---

## 2.3 ACM Validation Records

When issuing an SSL certificate in AWS Certificate Manager for:

- `audexaai.com`
- `www.audexaai.com`

ACM generates **CNAME** DNS validation records.

Example:

```
_acme-challenge.audexaai.com → abcdef12345.acm-validations.aws.
_acme-challenge.www.audexaai.com → xyz9876.acm-validations.aws.
```

Add these **exactly** as shown in Route53.

Once validated, ACM will show **ISSUED**.

---

## 3. CloudFront Configuration (DNS-related fields)

Inside CloudFront:

### Alternate Domain Names (CNAMEs)
Add:

```
audexaai.com
www.audexaai.com
```

### SSL Certificate
Attach the ACM certificate that includes both domains.

---

## 4. DNS Flow Overview

```
User enters: www.audexaai.com
↓
Route53 DNS lookup
↓
CNAME → CloudFront distribution
↓
CloudFront fetches from private S3 bucket (via OAC)
↓
Static website served securely over HTTPS
```

---

## 5. DNS Records Summary

| Type | Name | Value | Purpose |
|------|------|--------|----------|
| NS | audexaai.com | Route53 NS servers | Delegates DNS to AWS |
| SOA | audexaai.com | Automatic | Required root record |
| A (Alias) | audexaai.com | CloudFront | Root domain routing |
| CNAME | www.audexaai.com | CloudFront domain | Subdomain routing |
| CNAME | ACM Validation | ACM validation endpoints | SSL issuance |

---

## 6. Notes

- NameBright should have **no DNS records** after switching nameservers.  
  Route53 is authoritative.
- DNS changes may take 5–30 minutes to propagate.
- Certificate will not issue unless ACM CNAME validation is correct.

---

End of DNS configuration file.
