export type MailingList = {
  advertised: boolean;
  display_name: string;
  fqdn_listname: string;
  list_id: string;
  list_name: string;
  mail_host: string;
  member_count: number;
  volume: number;
  description: string;
  self_link: string;
  http_etag: string;
};

export interface Member {
  address: string;
  bounce_score: number;
  last_bounce_received: string; // ISO 8601 timestamp
  last_warning_sent: string; // ISO 8601 timestamp (can be zero date)
  total_warnings_sent: number;
  delivery_mode: "regular" | "digest" | "mime_digest" | "disabled";
  email: string;
  list_id: string;
  subscription_mode: "as_address" | "as_user";
  role: "member" | "owner" | "moderator";
  user: string;
  display_name: string;
  self_link: string;
  member_id: string;
  http_etag: string;
}

export interface MailmanMember {
  address: string;
  bounce_score: number;
  last_warning_sent: string; // ISO timestamp (may be zero-date)
  total_warnings_sent: number;
  delivery_mode: "regular" | "digest" | "mime_digest" | "disabled";
  email: string;
  list_id: string;
  subscription_mode: "as_address" | "as_user";
  role: "member" | "owner" | "moderator";
  moderation_action?: "accept" | "hold" | "reject" | "discard";
  user: string;
  display_name: string;
  self_link: string;
  member_id: string;
  http_etag: string;
}
// Todo: new-db specific type declarations


export type UserSession = {

  expires: string;
  user: { email: string, id: string, name: string, role: string };

}

export type UserData = {
  counts: { owner: number; moderator: number; member: number; total: number };
  mailingLists: MailmanMember[];
  listsIDs: string[];
};