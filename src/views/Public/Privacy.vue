<template>
    <div class="privacy_page">
        <div class="max-width top">
            <div class="back" @click="emits('back')">
                <Icon :name="'arrow-left'" size="0.4rem" />
            </div>
            <span>Privacy Policy</span>
        </div>
        <div class="px-[0.32rem] flex flex-col relative mt-[0.4rem]">

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">The Platform will govern our dealings
                with and use of you in connection with your Benefits membership, your use
                of any page or website under our Platform brand (including applications we own and/or any mobile phone
                or tablet
                operated by us). We are committed to ensuring that the personal information we collect about you is
                protected,
                used, stored, and disclosed in accordance with applicable privacy laws and this Privacy Policy.</div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">1. Use of the Site</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">By using this site, you agree to be
                bound by the terms of this Privacy Policy. The Platform may periodically
                review the Privacy Policy and reserves the right to change the Privacy Policy at any time at its sole
                discretion
                by posting such changes on the site. Changes will be effective immediately upon posting on the website.
                Your
                continued use of this site after posting constitutes your acceptance of these changes. This Privacy
                Policy does
                not apply to websites linked to this website, nor does it apply to websites that this Platform does not
                control.</div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">2. Personal Information</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">The types of personal information
                that the Platform may collect from you include:<br><br>

                - Name<br><br>
                - Email address<br><br>
                - Personal preference<br><br>
                - Date of birth<br><br>
                - Country of Citizenship<br><br>
                - Real address<br><br>
                - Identification number<br><br>
                - Government-issued identification<br><br>
                - Location data<br><br>
                - Device information<br><br>
                - IP address<br><br>

                The Platform collects or may collect such information by:<br><br>

                - Entering data during account registration<br><br>
                - Communicating with customers</div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">3. Purpose of Collection</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">This Platform will only collect your
                personal information in a legal and fair manner and will not use its
                business in an intrusive manner for the following purposes:<br><br>

                - Know Your Customer (KYC) authentication.<br><br>
                - If you wish to subscribe to marketing communications from the Platform.<br><br>
                - Process your application to become a member of the Platform or any hosted subdomain.<br><br>
                - Provide and improve services to members.<br><br>
                - Identify you as a member and verify your identity for security purposes and to comply with legal
                obligations.<br><br>
                - Maintain your membership account.<br><br>
                - Upgrade and enhance your experience within the site or through customer service interactions.<br><br>
                - Conduct market research and promotional activities.<br><br>
                - Communicate with you via email, text message, or phone regarding products or services.<br><br>
                - Create aggregated data about members through demographic and statistical analysis.<br><br>
                - Respond to your questions, comments, or requests.<br><br>
                - Determine member liability for tax obligations, if applicable.<br><br>
                - Comply with contractual, legal, and statutory obligations.<br><br>
                - Take appropriate action if illegal activity or misconduct is suspected.<br><br>
                - Establish, exercise, or defend any legal claim.<br><br>
                - Manage job applications.<br><br>

                If you do not provide the Platform with the requested personal information, we may not be able to
                process your
                membership application, provide you with our services, or respond to inquiries or complaints.<br><br>

                By using the Platform, becoming a member, or otherwise choosing to provide personal information to the
                Platform,
                you agree to the collection, use, processing, and disclosure of your personal information for the above
                purposes
                and in accordance with this Privacy Policy.</div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">4. Direct Marketing and Opting Out</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">From time to time, we may use your
                personal information to notify you of products, services, or promotions that
                may be of interest or beneficial to you. We may do this by email, text message, phone call, or mail. If
                you no
                longer wish to receive marketing or promotional materials from the Platform, you can contact us by email
                at any
                time, and we will process your request as soon as possible.<br><br>

                From time to time, we may contact you regarding the administration of your Platform account. Such
                communications
                may be made using any of the contact details provided during registration. These communications will not
                affect
                your opt-in or opt-out status for direct marketing communications.</div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">5. Management of Your Personal Information</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">The Platform will take all reasonable
                steps to ensure that the personal information it collects, uses, or
                discloses is correct and stored in a secure environment that only authorized personnel can access. We
                store our
                services for as long as necessary to fulfill the purposes for which we collected them, provide our
                services,
                resolve disputes, establish legal defenses, conduct audits, pursue legitimate business purposes, and
                enforce our
                agreements.</div>
        </div>
    </div>

</template>
<script setup>
import { Icon } from 'vant'

const emits = defineEmits(['back'])

</script>
<style lang="less">
.privacy_page {
    .top {
        top: 0;
        position: sticky;
        left: 50%;
        width: 100%;
        height: 1.12rem;
        background-color: var(--ex-bg-color);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 0.8rem;
        color: var(--ex-text-color);
        font-size: 0.36rem;
        font-weight: 500;
        text-align: center;
        line-height: 1.05;
        z-index: 2000;

        .back {
            position: absolute;
            left: 0.32rem;
            width: 0.4rem;
            height: 0.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .right {
            position: absolute;
            right: 0.32rem;
        }
    }
}
</style>