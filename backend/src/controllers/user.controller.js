import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
    try {
        const {
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault,
        } = req.body;
        const user = req.user;
        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }
        user.addresses.push({
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault: isDefault ?? false,
        });
        await user.save();
        res.status(201).json({
            message: "Address added successfully",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Error in creating address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAddress(req, res) {
    try {
        const user = req.user;
        res.status(200).json({
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Error in getting address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateAddress(req, res) {
    try {
        const { addressId } = req.params;
        const {
            label,
            fullName,
            streetAddress,
            city,
            state,
            zipCode,
            phoneNumber,
            isDefault,
        } = req.body;
        const user = req.user;
        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }
        if (label !== undefined) address.label = label;
        if (fullName !== undefined) address.fullName = fullName;
        if (streetAddress !== undefined) address.streetAddress = streetAddress;
        if (city !== undefined) address.city = city;
        if (state !== undefined) address.state = state;
        if (zipCode !== undefined) address.zipCode = zipCode;
        if (phoneNumber !== undefined) address.phoneNumber = phoneNumber;
        if (isDefault !== undefined) {
            if (isDefault) {
                user.addresses.forEach((addr) => {
                    addr.isDefault = false;
                });
            }
            address.isDefault = isDefault;
        }
        await user.save();
        res.status(200).json({
            message: "Address updated successfully",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Error in updating address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params;
        const user = req.user;
        user.addresses.pull(addressId);
        await user.save();
        res.status(200).json({
            message: "Address deleted successfully",
            addresses: user.addresses,
        });
    } catch (error) {
        console.error("Error in deleting address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function addToWishList(req, res) {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (user.wishList.includes(productId)) {
            return res.status(400).json({
                error: "Product already exists in wishlist",
            });
        }
        user.wishList.push(productId);
        await user.save();
        res.status(200).json({
            message: "Product added to wishlist",
            wishList: user.wishList,
        });
    } catch (error) {
        console.error("Error in adding to wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function removeFromWishList(req, res) {
    try {
        const { productId } = req.params;
        const user = req.user;
        user.wishList.pull(productId);
        await user.save();
        res.status(200).json({
            message: "Product removed from wishlist",
            wishList: user.wishList,
        });
    } catch (error) {
        console.error("Error in removing from wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getWishList(req, res) {
    try {
        const user = await User.findById(req.user._id)
            .populate("wishList"); 
        res.status(200).json({
            wishList: user.wishList,
        });
    } catch (error) {
        console.error("Error in fetching wishlist:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}