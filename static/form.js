// Client-side form handler for contact form
// - Validates inputs (required, lengths, simple phone check)
// - Honeypot field to deter bots
// - Simple per-session rate limit (max submissions per 5 minutes)
// - Formats a well-structured email body and opens mail client via mailto for testing
// NOTE: For production, replace mailto flow with a server-side API or a transactional email service (SMTP/API).
(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusEl = document.getElementById("contact-status");
  const recipient = form.getAttribute("data-recipient") || "";

  const showStatus = (msg, isError) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.style.color = isError ? "#ff6b6b" : "#bde3a8";
  };

  // Simple helpers
  const isValidEmail = (email) => {
    // RFC-complete regex is long; use a safe reasonable pattern
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(email) && email.length <= 254;
  };

  // Strict Saudi phone validation and normalization
  // Acceptable input forms:
  // - 05XXXXXXXX (10 digits)
  // - +9665XXXXXXXX
  // - 9665XXXXXXXX
  // Returns normalized form like +9665XXXXXXXX or null if invalid
  const normalizeSaudiPhone = (phone) => {
    if (!phone) return null;
    // remove spaces, parentheses, dashes
    let cleaned = phone.replace(/[\s()\-\.]/g, "");

    // remove leading plus for easier handling
    if (cleaned.startsWith("+")) cleaned = cleaned.slice(1);

    // Now cleaned may start with 9665 or 05
    // If starts with 9665 and followed by 8 digits -> valid
    if (/^9665\d{8}$/.test(cleaned)) {
      return "+".concat(cleaned);
    }

    // If starts with 05 and has total 10 digits -> convert to +9665...
    if (/^05\d{8}$/.test(cleaned)) {
      return "+966".concat(cleaned.slice(1));
    }

    // If already starts with 5 and 9 digits (unlikely) reject
    return null;
  };

  // Rate limiting: allow max 3 submissions per session per 5 minutes
  const canSubmit = () => {
    try {
      const key = "contact_submissions";
      const raw = sessionStorage.getItem(key);
      const now = Date.now();
      const windowMs = 5 * 60 * 1000; // 5 minutes
      const max = 3;
      let arr = raw ? JSON.parse(raw) : [];
      // keep only recent
      arr = arr.filter((t) => now - t < windowMs);
      if (arr.length >= max) return false;
      arr.push(now);
      sessionStorage.setItem(key, JSON.stringify(arr));
      return true;
    } catch (e) {
      return true; // fail open if storage unavailable
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot
    if (form.querySelector('input[name="website"]').value) {
      showStatus("تم اكتشاف سلوك روبوت. الطلب مرفوض.", true);
      return;
    }

    // Gather values
    const name = (form.querySelector('[name="name"]').value || "").trim();
    const phone = (form.querySelector('[name="phone"]').value || "").trim();
    const email = (form.querySelector('[name="email"]').value || "").trim();
    const message = (form.querySelector('[name="message"]').value || "").trim();

    // Basic validation - require all fields
    // Focus the first invalid field for better UX
    if (!name) {
      const el = form.querySelector('[name="name"]');
      el && el.focus();
      return showStatus("الرجاء إدخال الاسم.", true);
    }

    if (!email || !isValidEmail(email)) {
      const el = form.querySelector('[name="email"]');
      el && el.focus();
      return showStatus("الرجاء إدخال بريد إلكتروني صالح.", true);
    }

    if (!phone) {
      const el = form.querySelector('[name="phone"]');
      el && el.focus();
      return showStatus("الرجاء إدخال رقم الجوال (السعودي).", true);
    }

    const normalizedPhone = normalizeSaudiPhone(phone);
    if (!normalizedPhone) {
      const el = form.querySelector('[name="phone"]');
      el && el.focus();
      return showStatus(
        "الرجاء إدخال رقم جوال سعودي صالح بصيغة 05XXXXXXXX أو +9665XXXXXXXX.",
        true
      );
    }

    if (!message || message.length < 8) {
      const el = form.querySelector('[name="message"]');
      el && el.focus();
      return showStatus("الرجاء إدخال وصف أطول (8 أحرف على الأقل).", true);
    }

    if (!canSubmit())
      return showStatus(
        "تم الوصول للحد الأقصى من المحاولات، حاول لاحقًا.",
        true
      );

    // Build a clear English subject and a nicely formatted plain-text email body
    const subject = encodeURIComponent(`[Website] Message from ${name}`);

    const bodyLines = [];
    bodyLines.push("New contact form submission");
    bodyLines.push("===========================");
    bodyLines.push(`Name: ${name}`);
    if (normalizedPhone) bodyLines.push(`Phone: ${normalizedPhone}`);
    bodyLines.push(`Email: ${email}`);
    bodyLines.push("");
    bodyLines.push("Message:");
    // Indent the message lines for readability
    message.split("\n").forEach((ln) => bodyLines.push(`  ${ln}`));
    bodyLines.push("");
    bodyLines.push("---");
    bodyLines.push(`Page: ${location.href}`);
    bodyLines.push(`Submitted: ${new Date().toLocaleString()}`);
    bodyLines.push("");
    bodyLines.push("Notes:");
    bodyLines.push(
      "  - This message was generated from the website contact form."
    );
    bodyLines.push(
      "  - Please reply to the email address provided above if you wish to contact the sender."
    );

    const body = encodeURIComponent(bodyLines.join("\n"));

    // For testing use mailto; in production replace with fetch to server endpoint
    if (form.getAttribute("data-send-via") === "mailto" && recipient) {
      const mailto = `mailto:${encodeURIComponent(
        recipient
      )}?subject=${subject}&body=${body}`;
      // Open mailto in a new window (will open default mail client)
      window.location.href = mailto;
      showStatus(
        "تم تجهيز البريد في برنامج البريد الافتراضي. تحقق من صندوق الصادر.",
        false
      );
      // Optionally, clear form
      form.reset();
      return;
    }

    // Fallback: show message that server-side is required
    showStatus(
      "هذه الصفحة معدة للاختبار (mailto). لارسال فعلي يرجى تهيئة خادم أو API بريد إلكتروني.",
      true
    );
  });
})();
