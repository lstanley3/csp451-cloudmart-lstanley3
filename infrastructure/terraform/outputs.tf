
output "resource_group_name" {
  description = "Name of the resource group."
  value       = azurerm_resource_group.cloudmart.name
}

output "vnet_name" {
  description = "Name of the virtual network."
  value       = azurerm_virtual_network.cloudmart_vnet.name
}

output "subnet_name" {
  description = "Name of the subnet."
  value       = azurerm_subnet.cloudmart_subnet.name
}

output "location" {
  description = "Azure region of the deployment."
  value       = azurerm_resource_group.cloudmart.location
}
