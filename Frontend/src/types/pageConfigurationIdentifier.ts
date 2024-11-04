export type PageConfigurationIdentifier = string & {
  isPageConfigurationIdentifier: true;
};

export function toPageConfigurationIdentifier(
  identifier: string
): PageConfigurationIdentifier {
  return identifier as PageConfigurationIdentifier;
}
