import { HttpHeaders } from '@angular/common/http';
import { JsonObject, JsonProperty } from 'json2typescript';

export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
  })
};

@JsonObject("SiteVerify")
export class SiteVerify {
  @JsonProperty("secret")
  public secret: string;

  @JsonProperty("response")
  public response: string;

  @JsonProperty("remoteip")
  public remoteip: string;
}

@JsonObject("SiteVerifyResponse")
export class SiteVerifyResponse {
  @JsonProperty("success")
  public success: boolean;

  @JsonProperty("challenge_ts")
  public challenge_ts: number;

  @JsonProperty("hostname")
  public hostname: string;

  @JsonProperty("error-codes")
  public errorCodes: [];
}