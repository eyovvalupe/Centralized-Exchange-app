<template>
    <div class="usage_page">
        <div class="max-width top">
            <div class="back" @click="emits('back')">
                <Icon :name="'arrow-left'" size="0.4rem" />
            </div>
            <span>Terms of Service</span>
        </div>
        <div class="px-[0.32rem] mt-[0.4rem]">
            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">1. General</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">
                You ("User" or "You") should read this End User Agreement ("Agreement") in its entirety before using
                the
                services or products of the Platform. Please note that this agreement constitutes a legally binding
                agreement between you and the platform.<br><br>

                These terms and conditions will be effective immediately after you complete the registration
                process,
                which
                includes selecting the checkbox to accept these terms and conditions and successfully create an
                account.
                By
                using any part of this site after creating an account, you agree to these terms and conditions that
                apply to
                your use of this site.<br><br>

                You must read these terms and conditions in their entirety before creating an account. If you do not
                agree
                to any provision of these terms and conditions, you may not create an account or continue to use the
                site.<br><br>

                We reserve the right to modify these terms and conditions at any time without notice. If we make
                such
                changes, we may take appropriate steps to bring such changes to your attention (such as notices by
                email
                or
                prominently on our website, and revised terms and conditions), but you are solely responsible for
                checking
                for any
                revisions, updates and/or modifications. Your continued use of the Platform Services and Website
                following
                any such revisions to the Terms and Conditions will be deemed your acceptance and agreement to be
                bound
                by
                such
                revisions, updates, and/or modifications.<br><br>

                If you provide and/or use the Services, by clicking the "I Agree" button, you agree to the terms and
                conditions set forth in this Agreement.<br><br>

                These terms and conditions may be published in multiple languages for information and player
                convenience.
                The English version is the sole legal basis of your relationship with us and the English version of
                these
                terms
                and conditions shall control in the event of any discrepancy from a translation of any kind.
            </div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">2. Trading Account - Registration</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">In order for you to be able to
                trade
                on
                the Platform, you must first personally register for an account with us
                ("Trading Account").

                As part of the registration process, you must provide your date of birth, a valid email, and choose
                a
                username
                and password to log into the platform. You must enter all required information in the registration
                form.
                You
                are
                responsible for ensuring that the information you provide is true, complete, and correct. You must
                choose a
                username that is not disruptive or offensive.<br><br>

                You are solely responsible for ensuring that your login details are kept securely. You must not
                disclose
                your
                login details to anyone. We will not be responsible for any misuse or unauthorized access of your
                account by
                third parties resulting from your disclosure of your login details to any third party (whether
                intentional,
                accidental, active, or passive).<br><br>

                You can only have one trading account. If you attempt to open more than one trading account, all of
                your
                accounts may be frozen, suspended, or closed, and any amount of cryptocurrency credited to your
                account
                will
                be
                frozen.<br><br>

                If you become aware that you have registered for more than one trading account, you must notify us
                immediately.
                Failure to do so may result in your trading account being frozen.<br><br>

                You will notify us as soon as you become aware of any errors relating to your account or any issues
                relating
                to
                your transactions. We reserve the right to declare void any transactions that may contain such
                errors.<br><br>

                The platform does not accept individual registration:<br><br>

                Are under the age of 18 or the legal age of majority in their jurisdiction or participate in
                platform
                transactions;<br><br>

                Residing in an illegal jurisdiction is not permitted. The platform cannot verify the legality of the
                service
                in
                every jurisdiction, and it is the user's responsibility to ensure the legality of their use of the
                service.<br>

                Provide misleading information or attempt to pass third parties.<br><br>

                Selling, transferring, or acquiring accounts to other users is prohibited.</div><br>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">3. Authorization</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.6rem] ml-[0.38rem]">The platform reserves the right
                to
                request any documents it deems necessary to determine the identity and
                location of the user at any time. The platform reserves the right to limit services, payments, or
                withdrawals
                until fully determined or for any other reasons of interest. The platform also reserves the right to
                disclose
                user information when permitted by legal procedures or the privacy policies of interested parties
                (platform
                owners and operators). Using this service means that you acknowledge and agree to the possibility of
                such
                disclosure.</div>

            <div class="text-[0.36rem] leading-[0.48rem] mb-[0.4rem]">4. Warranty</div>

            <div class="text-[0.32rem] leading-[0.48rem] mb-[0.4rem] ml-[0.38rem]">Before you use the service, you
                represent, warrant, undertake, and agree that:

                You are at least 18 years of age or the other legal age of majority as determined by any law
                applicable
                to
                you,
                whichever is earlier;<br><br>

                You are fully capable of entering into legally binding agreements with us and you are not bound by
                any
                form
                of
                limited legal capacity;<br><br>

                You have not been diagnosed or classified as a compulsive or problem gambler;<br><br>

                You access the Platform from a legal jurisdiction;<br><br>

                All information you provide to us is accurate and complete.</div><br>
        </div>
    </div>
</template>
<script setup>
import { Icon } from 'vant'

const emits = defineEmits(['back'])

</script>
<style lang="less">
.usage_page {
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