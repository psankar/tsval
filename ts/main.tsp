import "@typespec/http";

using Http;

@service(#{ title: "Demo Service" })
namespace DemoService;

@error
model Error {
  code: int32;
  message: string;
}

union Region {
  USA: "USA",
  IND: "IND",
  FRA: "FRA",
  SGP: "SGP",
}

model UserSignupRequest {
  @minLength(3)
  @maxLength(64)
  full_name: string;

  @format("email")
  @minLength(3)
  @maxLength(64)
  email: string;

  @minLength(8)
  @maxLength(64)
  @secret
  password: string;

  region: Region;
}

model UserSignupResponse {
  user_id: string;
}

@route("/users")
@tag("Users")
interface Users {
  @route("/signup")
  @post
  signup(@body user: UserSignupRequest): UserSignupResponse | Error;
}
