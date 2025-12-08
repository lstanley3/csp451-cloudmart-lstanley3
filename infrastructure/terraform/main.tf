# Resource Group
resource "azurerm_resource_group" "cloudmart" {
  name     = var.resource_group_name
  location = var.location
}

# Virtual Network
resource "azurerm_virtual_network" "cloudmart_vnet" {
  name                = "${var.project_name}-vnet"
  address_space       = var.vnet_address_space
  location            = azurerm_resource_group.cloudmart.location
  resource_group_name = azurerm_resource_group.cloudmart.name
}

# Subnet for app/infra
resource "azurerm_subnet" "cloudmart_subnet" {
  name                 = "${var.project_name}-subnet"
  resource_group_name  = azurerm_resource_group.cloudmart.name
  virtual_network_name = azurerm_virtual_network.cloudmart_vnet.name
  address_prefixes     = [var.subnet_address_prefix]
}
