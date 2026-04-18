import { useState } from "react";
import { isValidEmail } from "../utils/emailValidation";

const initialForm = {
  name: "",
  email: "",
  teamName: "",
  role: "",
  projectIdea: ""
};

const requiredFields = ["name", "email", "role", "projectIdea"];

function getFieldError(name, rawValue) {
  const value = String(rawValue || "").trim();

  switch (name) {
    case "name":
      return value ? "" : "请填写姓名。";
    case "email":
      if (!value) return "请填写邮箱。";
      return isValidEmail(value) ? "" : "邮箱后缀不合法。";
    case "role":
      if (!value) return "请填写角色。";
      return value.length >= 2 ? "" : "角色至少需要 2 个字符。";
    case "projectIdea":
      if (!value) return "请填写想法简介。";
      return value.length >= 10 ? "" : "想法简介至少需要 10 个字符。";
    default:
      return "";
  }
}

function validateForm(values) {
  const errors = {};

  for (const fieldName of requiredFields) {
    const errorText = getFieldError(fieldName, values[fieldName]);
    if (errorText) {
      errors[fieldName] = errorText;
    }
  }

  return errors;
}

export function ApplyForm() {
  const [form, setForm] = useState(initialForm);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));

    setFieldErrors((current) => {
      if (!touchedFields[name] && !current[name]) return current;

      const nextError = getFieldError(name, value);
      const next = { ...current };
      if (nextError) next[name] = nextError;
      else delete next[name];
      return next;
    });
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    setTouchedFields((current) => ({ ...current, [name]: true }));
    setFieldErrors((current) => {
      const nextError = getFieldError(name, value);
      const next = { ...current };
      if (nextError) next[name] = nextError;
      else delete next[name];
      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextTouched = { ...touchedFields };
    requiredFields.forEach((fieldName) => {
      nextTouched[fieldName] = true;
    });
    setTouchedFields(nextTouched);

    const nextErrors = validateForm(form);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setError(true);
      setMessage("请先修正表单中的错误后再提交。");
      return;
    }

    setPending(true);
    setMessage("");
    setError(false);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();
      setError(!response.ok || !result.ok);
      setMessage(result.message || (response.ok ? "提交成功。" : "提交失败。"));
      if (response.ok && result.ok) {
        setForm(initialForm);
        setFieldErrors({});
        setTouchedFields({});
      }
    } catch {
      setError(true);
      setMessage("网络异常，请稍后再试。");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="apply-form" onSubmit={handleSubmit} noValidate>
      <div className="apply-form__topbar">
        <span className="apply-form__eyebrow">Application Form</span>
        <p className="apply-form__hint">信息会自动发送到报名邮箱，并可选发回执确认。</p>
      </div>
      <div className="apply-form__grid">
        <label className="apply-form__field">
          <span>姓名</span>
          <input
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={updateField}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldErrors.name)}
            required
          />
          {touchedFields.name && fieldErrors.name ? <p className="apply-form__field-error">{fieldErrors.name}</p> : null}
        </label>
        <label className="apply-form__field">
          <span>邮箱</span>
          <input
            name="email"
            type="text"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            value={form.email}
            onChange={updateField}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldErrors.email)}
            required
          />
          {touchedFields.email && fieldErrors.email ? <p className="apply-form__field-error">{fieldErrors.email}</p> : null}
        </label>
        <label className="apply-form__field">
          <span>团队/项目名</span>
          <input name="teamName" autoComplete="organization" value={form.teamName} onChange={updateField} />
        </label>
        <label className="apply-form__field">
          <span>角色</span>
          <input
            name="role"
            autoComplete="organization-title"
            value={form.role}
            onChange={updateField}
            onBlur={handleBlur}
            aria-invalid={Boolean(fieldErrors.role)}
            required
          />
          {touchedFields.role && fieldErrors.role ? <p className="apply-form__field-error">{fieldErrors.role}</p> : null}
        </label>
      </div>
      <label className="apply-form__field apply-form__field--full">
        <span>想法简介</span>
        <textarea
          name="projectIdea"
          rows={6}
          value={form.projectIdea}
          onChange={updateField}
          onBlur={handleBlur}
          aria-invalid={Boolean(fieldErrors.projectIdea)}
          required
        />
        {touchedFields.projectIdea && fieldErrors.projectIdea ? (
          <p className="apply-form__field-error">{fieldErrors.projectIdea}</p>
        ) : null}
      </label>
      <div className="apply-form__actions">
        <button className="button button--primary" type="submit" disabled={pending}>
          {pending ? "发送中…" : "提交报名"}
        </button>
        <span className={`apply-form__message ${error ? "is-error" : "is-success"}`} role="status" aria-live="polite">
          {message}
        </span>
      </div>
    </form>
  );
}
