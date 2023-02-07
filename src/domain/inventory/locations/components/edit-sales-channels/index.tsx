import { StockLocationExpandedDTO } from "@medusajs/medusa"
import {
  useAdminAddLocationToSalesChannel,
  useAdminRemoveLocationFromSalesChannel,
} from "medusa-react"
import Button from "../../../../../components/fundamentals/button"
import useToggleState from "../../../../../hooks/use-toggle-state"
import SalesChannelsModal from "../../../../products/components/sales-channels-modal"

const EditSalesChannels = ({
  location,
}: {
  location: StockLocationExpandedDTO
}) => {
  const {
    state: showSalesChannelsModal,
    close: closeSalesChannelsModal,
    open: openSalesChannelsModal,
  } = useToggleState()

  const { mutate: addLocationToSalesChannel } =
    useAdminAddLocationToSalesChannel()
  const { mutateAsync: removeLocationFromSalesChannel } =
    useAdminRemoveLocationFromSalesChannel()

  const onSave = async (channels) => {
    const existingChannels = location.sales_channels
    const channelsToRemove =
      existingChannels?.filter(
        (existingChannel) =>
          !channels.some((channel) => existingChannel.id === channel.id)
      ) ?? []
    const channelsToAdd = channels.filter(
      (channel) =>
        existingChannels &&
        !existingChannels.some(
          (existingChannel) => existingChannel.id === channel.id
        )
    )
    for (const channelToRemove of channelsToRemove) {
      await removeLocationFromSalesChannel({
        sales_channel_id: channelToRemove.id,
        location_id: location.id,
      })
    }
    for (const channelToAdd of channelsToAdd) {
      await addLocationToSalesChannel({
        sales_channel_id: channelToAdd.id,
        location_id: location.id,
      })
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        size="small"
        type="button"
        onClick={openSalesChannelsModal}
      >
        {location.sales_channels && location.sales_channels.length > 0
          ? "Edit channels"
          : "Add channels"}
      </Button>
      <SalesChannelsModal
        open={showSalesChannelsModal}
        source={location.sales_channels}
        onClose={closeSalesChannelsModal}
        onSave={onSave}
      />
    </>
  )
}

export default EditSalesChannels