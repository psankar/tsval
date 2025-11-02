import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { FormProps } from "antd";
import { Button, Form, Input, Select, type FormInstance } from "antd";
import userSignupRequestSchema from "node_modules/jsonschema/UserSignupRequest.json";
import type { UserSignupRequest } from "node_modules/test-package/src";

// Initialize AJV
const ajv = new Ajv({ allErrors: true });
addFormats(ajv); // Add formats like "email"

// The schema is imported as a module, so we need to access the default export if it exists
const schemaToValidate = userSignupRequestSchema;
const validate = ajv.compile(schemaToValidate);

// --- Form Event Handlers ---
const onFinish: FormProps<UserSignupRequest>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<UserSignupRequest>["onFinishFailed"] = (
  errorInfo
) => {
  console.log("Failed:", errorInfo);
};

const jsonSchemaValidator = (form: FormInstance): Promise<void> => {
  const formData = form.getFieldsValue(true);
  const valid = validate(formData);
  if (valid) {
    // If the whole form is valid, clear any existing errors
    const fields = Object.keys(schemaToValidate.properties).map((name) => ({
      name,
      errors: [],
    }));
    form.setFields(fields);
    return Promise.resolve();
  }
  // Map AJV errors to Ant Design's format
  const errorFields = Object.keys(schemaToValidate.properties).map(
    (fieldName) => {
      const errors =
        validate.errors
          ?.filter((e) => e.instancePath === `/${fieldName}`)
          .map((e) => e.message || "Invalid input") ?? [];
      return { name: fieldName, errors };
    }
  );

  form.setFields(errorFields);
  return Promise.reject("Validation failed");
};

const SignupPage = () => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {/* A single validator item that re-validates the whole form on any change */}
      <Form.Item
        name="ajv-validator"
        rules={[{ validator: (_, value) => jsonSchemaValidator(form) }]}
      >
        <></>
      </Form.Item>

      <Form.Item<UserSignupRequest> label="Full Name" name="fullName">
        <Input />
      </Form.Item>

      <Form.Item<UserSignupRequest> label="Email" name="email">
        <Input />
      </Form.Item>

      <Form.Item<UserSignupRequest> label="Password" name="password">
        <Input.Password />
      </Form.Item>

      <Form.Item<UserSignupRequest> label="Region" name="region">
        <Select placeholder="Select your region">
          <Select.Option value="USA">USA</Select.Option>
          <Select.Option value="IND">India</Select.Option>
          <Select.Option value="FRA">France</Select.Option>
          <Select.Option value="SGP">Singapore</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupPage;
