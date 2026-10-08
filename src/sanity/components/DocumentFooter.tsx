import { Flex, Text } from '@sanity/ui';
import { ViewStagingButton } from './ViewStagingButton';

/** Sits in the document footer, immediately to the left of Publish. */
export function DocumentFooter() {
  return (
    <Flex align="center" gap={3}>
      <Text size={1} muted>
        Este borrador ya se ve en Staging. En hiweb.com.mx aparece cuando pulsas Publish.
      </Text>
      <ViewStagingButton />
    </Flex>
  );
}
