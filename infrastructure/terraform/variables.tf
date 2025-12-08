variable "project_name" {
  description = "Short name for the project, used as a prefix."
  type        = string
  default     = "cloudmart"
}

variable "location" {
  description = "Azure region to deploy to."
  type        = string
  default     = "canadacentral"
}

variable "resource_group_name" {
  description = "Name of the resource group."
  type        = string
  default     = "cloudmart-rg"
}

variable "vnet_address_space" {
  description = "Address space for the virtual network."
  type        = list(string)
  default     = ["10.10.0.0/16"]
}

variable "subnet_address_prefix" {
  description = "Address prefix for the main subnet."
  type        = string
  default     = "10.10.1.0/24"
}
